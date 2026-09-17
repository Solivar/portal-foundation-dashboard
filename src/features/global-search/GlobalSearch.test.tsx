import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { searchKnowledgeArticles } from '../../api/knowledgeArticleService';
import { searchProducts } from '../../api/productService';
import { searchTickets } from '../../api/ticketService';
import type { KnowledgeArticle } from '../../types/knowledgeArticle';
import type { Product } from '../../types/product';
import type { ServiceTicket } from '../../types/supportTicket';
import { GlobalSearch } from './GlobalSearch';
import { GLOBAL_SEARCH_DEBOUNCE_DELAY_MS } from './globalSearch.constants';

vi.mock('../../api/productService', () => ({
  searchProducts: vi.fn(),
}));

vi.mock('../../api/knowledgeArticleService', () => ({
  searchKnowledgeArticles: vi.fn(),
}));

vi.mock('../../api/ticketService', () => ({
  searchTickets: vi.fn(),
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
}

function advanceDebounce() {
  act(() => {
    vi.advanceTimersByTime(GLOBAL_SEARCH_DEBOUNCE_DELAY_MS);
  });
}

function advanceAlmostToDebounce() {
  act(() => {
    vi.advanceTimersByTime(GLOBAL_SEARCH_DEBOUNCE_DELAY_MS - 1);
  });
}

function focusSearch() {
  const input = screen.getByLabelText('Global search');

  fireEvent.focus(input);

  return input;
}

function typeSearch(query: string) {
  const input = screen.getByLabelText('Global search');

  fireEvent.change(input, {
    target: { value: query },
  });

  return input;
}

function mockPendingSearches() {
  const pendingSearch = new Promise<never>(() => undefined);

  vi.mocked(searchProducts).mockReturnValue(pendingSearch);
  vi.mocked(searchKnowledgeArticles).mockReturnValue(pendingSearch);
  vi.mocked(searchTickets).mockReturnValue(pendingSearch);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(searchProducts).mockReset();
  vi.mocked(searchKnowledgeArticles).mockReset();
  vi.mocked(searchTickets).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('panel visibility', () => {
  test('Escape closes the panel without clearing the query or losing input focus', () => {
    mockPendingSearches();
    render(<GlobalSearch />);

    const input = screen.getByLabelText('Global search');
    act(() => input.focus());
    typeSearch('cloud');

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
    expect(fireEvent.keyDown(input, { key: 'Escape' })).toBe(false);

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(input).toHaveValue('cloud');

    typeSearch('cloud backup');

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
  });

  test('Escape bubbles from the results panel to the form and closes the panel', () => {
    mockPendingSearches();
    render(<GlobalSearch />);

    const input = screen.getByLabelText('Global search');
    act(() => input.focus());
    typeSearch('cloud');

    const panel = screen.getByRole('region', { name: 'Search results' });

    fireEvent.keyDown(panel, { key: 'Escape' });

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(input).toHaveValue('cloud');
  });

  test('focusing the input again reopens the panel after Escape', () => {
    render(
      <>
        <GlobalSearch />
        <button type="button">Outside control</button>
      </>,
    );

    const input = screen.getByLabelText('Global search');
    act(() => input.focus());
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();

    act(() => screen.getByRole('button', { name: 'Outside control' }).focus());
    act(() => input.focus());

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
  });

  test('other keys do not dismiss the panel or prevent their default behavior', () => {
    render(<GlobalSearch />);
    const input = focusSearch();

    expect(fireEvent.keyDown(input, { key: 'ArrowDown' })).toBe(true);

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
  });

  test('pending search completion does not reopen the panel after Escape', async () => {
    const products = createDeferred<Product[]>();
    vi.mocked(searchProducts).mockReturnValue(products.promise);
    vi.mocked(searchKnowledgeArticles).mockResolvedValue([]);
    vi.mocked(searchTickets).mockResolvedValue([]);
    render(<GlobalSearch />);

    const input = focusSearch();
    typeSearch('cloud');
    advanceDebounce();
    fireEvent.keyDown(input, { key: 'Escape' });

    await act(async () => {
      products.resolve([
        { id: 'PRD-1002', name: 'Cloud Backup Essentials', category: 'Cloud services' },
      ]);
      await products.promise;
    });

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(input).toHaveValue('cloud');
  });

  test('shows the idle prompt when the input is focused', () => {
    render(<GlobalSearch />);

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();

    focusSearch();

    expect(screen.getByRole('region', { name: 'Search results' })).toHaveTextContent(
      'Start typing and results will appear here.',
    );
  });

  test('closes the panel when the user clicks outside the search', () => {
    render(
      <>
        <GlobalSearch />
        <button type="button">Outside control</button>
      </>,
    );

    focusSearch();

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside control' }));

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();
    expect(searchProducts).not.toHaveBeenCalled();
    expect(searchKnowledgeArticles).not.toHaveBeenCalled();
    expect(searchTickets).not.toHaveBeenCalled();
  });

  test('closes the panel when keyboard focus moves outside the search', () => {
    render(
      <>
        <GlobalSearch />
        <button type="button">Outside control</button>
      </>,
    );

    const input = focusSearch();
    const outsideControl = screen.getByRole('button', { name: 'Outside control' });

    fireEvent.blur(input, { relatedTarget: outsideControl });

    expect(screen.queryByRole('region', { name: 'Search results' })).not.toBeInTheDocument();
  });

  test('keeps the panel open when blur has no next focus target', () => {
    render(<GlobalSearch />);
    const input = focusSearch();

    fireEvent.blur(input, { relatedTarget: null });

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
  });

  test('allows keyboard focus to move from the input into the panel', () => {
    render(<GlobalSearch />);
    focusSearch();
    const panel = screen.getByRole('region', { name: 'Search results' });

    act(() => panel.focus());

    expect(panel).toHaveFocus();
    expect(panel).toBeInTheDocument();
  });

  test('keeps the panel open when the user presses a search result', async () => {
    vi.mocked(searchProducts).mockResolvedValue([
      { id: 'PRD-1002', name: 'Cloud Backup Essentials', category: 'Cloud services' },
    ]);
    vi.mocked(searchKnowledgeArticles).mockResolvedValue([]);
    vi.mocked(searchTickets).mockResolvedValue([]);
    render(<GlobalSearch />);

    focusSearch();
    typeSearch('cloud');
    advanceDebounce();
    vi.useRealTimers();

    const result = await screen.findByText('Cloud Backup Essentials');
    fireEvent.pointerDown(result);

    expect(screen.getByRole('region', { name: 'Search results' })).toBeInTheDocument();
  });
});

describe('debounced requests', () => {
  test('fires one search request per source after typing a word', () => {
    mockPendingSearches();

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('c');
    typeSearch('cl');
    typeSearch('clo');
    typeSearch('cloud');

    advanceAlmostToDebounce();

    expect(searchProducts).not.toHaveBeenCalled();
    expect(searchKnowledgeArticles).not.toHaveBeenCalled();
    expect(searchTickets).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(searchProducts).toHaveBeenCalledTimes(1);
    expect(searchKnowledgeArticles).toHaveBeenCalledTimes(1);
    expect(searchTickets).toHaveBeenCalledTimes(1);
    expect(searchProducts).toHaveBeenCalledWith('cloud');
    expect(searchKnowledgeArticles).toHaveBeenCalledWith('cloud');
    expect(searchTickets).toHaveBeenCalledWith('cloud');
  });

  test('fires a new search when typing pauses longer than the debounce delay', () => {
    mockPendingSearches();

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('clo');
    advanceDebounce();

    expect(searchProducts).toHaveBeenCalledTimes(1);
    expect(searchProducts).toHaveBeenLastCalledWith('clo');

    typeSearch('cloud');
    advanceAlmostToDebounce();

    expect(searchProducts).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(searchProducts).toHaveBeenCalledTimes(2);
    expect(searchKnowledgeArticles).toHaveBeenCalledTimes(2);
    expect(searchTickets).toHaveBeenCalledTimes(2);
    expect(searchProducts).toHaveBeenLastCalledWith('cloud');
    expect(searchKnowledgeArticles).toHaveBeenLastCalledWith('cloud');
    expect(searchTickets).toHaveBeenLastCalledWith('cloud');
  });
});

describe('result states', () => {
  test('searches all sources and renders grouped results', async () => {
    vi.mocked(searchProducts).mockResolvedValue([
      { id: 'PRD-1002', name: 'Cloud Backup Essentials', category: 'Cloud services' },
    ]);
    vi.mocked(searchKnowledgeArticles).mockResolvedValue([
      {
        id: 'KB-2002',
        title: 'Configuring cloud backup retention',
        summary: 'Recommended retention settings for cloud workloads.',
      },
    ]);
    vi.mocked(searchTickets).mockResolvedValue([
      { id: 'TCK-1038', status: 'Waiting for customer', priority: 'Medium' },
    ]);

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('cloud');

    expect(screen.getByText('Searching...')).toBeInTheDocument();
    expect(searchProducts).not.toHaveBeenCalled();

    advanceDebounce();
    vi.useRealTimers();

    expect(searchProducts).toHaveBeenCalledWith('cloud');
    expect(searchKnowledgeArticles).toHaveBeenCalledWith('cloud');
    expect(searchTickets).toHaveBeenCalledWith('cloud');
    expect(await screen.findByText('Cloud Backup Essentials')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Knowledge Articles' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Support Tickets' })).toBeInTheDocument();
    expect(screen.getByText('Configuring cloud backup retention')).toBeInTheDocument();
    expect(screen.getByText('TCK-1038')).toBeInTheDocument();
  });

  test('shows empty results when all sources return no matches', async () => {
    vi.mocked(searchProducts).mockResolvedValue([]);
    vi.mocked(searchKnowledgeArticles).mockResolvedValue([]);
    vi.mocked(searchTickets).mockResolvedValue([]);

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('missing');
    advanceDebounce();
    vi.useRealTimers();

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  test('shows an error when any source fails', async () => {
    vi.mocked(searchProducts).mockRejectedValue(new Error('Product search failed'));
    vi.mocked(searchKnowledgeArticles).mockResolvedValue([]);
    vi.mocked(searchTickets).mockResolvedValue([]);

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('cloud');
    advanceDebounce();
    vi.useRealTimers();

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to complete search.');
  });
});

describe('stale requests', () => {
  test('does not let stale search results overwrite a newer query', async () => {
    const firstProducts = createDeferred<Product[]>();
    const firstArticles = createDeferred<KnowledgeArticle[]>();
    const firstTickets = createDeferred<ServiceTicket[]>();
    const secondProducts = createDeferred<Product[]>();
    const secondArticles = createDeferred<KnowledgeArticle[]>();
    const secondTickets = createDeferred<ServiceTicket[]>();

    vi.mocked(searchProducts)
      .mockReturnValueOnce(firstProducts.promise)
      .mockReturnValueOnce(secondProducts.promise);
    vi.mocked(searchKnowledgeArticles)
      .mockReturnValueOnce(firstArticles.promise)
      .mockReturnValueOnce(secondArticles.promise);
    vi.mocked(searchTickets)
      .mockReturnValueOnce(firstTickets.promise)
      .mockReturnValueOnce(secondTickets.promise);

    render(<GlobalSearch />);

    focusSearch();
    typeSearch('laptop');
    advanceDebounce();

    typeSearch('gateway');
    advanceDebounce();

    await act(async () => {
      secondProducts.resolve([
        { id: 'PRD-1003', name: 'Secure Network Gateway', category: 'Security' },
      ]);
      secondArticles.resolve([]);
      secondTickets.resolve([]);
      await secondProducts.promise;
      await secondArticles.promise;
      await secondTickets.promise;
    });

    expect(screen.getByText('Secure Network Gateway')).toBeInTheDocument();

    await act(async () => {
      firstProducts.resolve([
        { id: 'PRD-1001', name: 'Atea Managed Laptop', category: 'Workplace' },
      ]);
      firstArticles.resolve([]);
      firstTickets.resolve([]);
      await firstProducts.promise;
      await firstArticles.promise;
      await firstTickets.promise;
    });

    expect(screen.queryByText('Atea Managed Laptop')).not.toBeInTheDocument();
    expect(screen.getByText('Secure Network Gateway')).toBeInTheDocument();
  });
});

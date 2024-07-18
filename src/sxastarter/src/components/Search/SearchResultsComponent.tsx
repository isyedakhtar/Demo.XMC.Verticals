import {
  FilterAnd,
  FilterEqual,
  SearchResultsInitialState,
  SearchResultsStoreState,
  SearchResultsWidgetQuery,
  useSearchResults,
  widget,
  WidgetDataType,
} from '@sitecore-search/react';
import Link from 'next/link';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  url?: string;
  description?: string;
  longdescription?: string;
  source_id?: string;
};

type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  emptyMessage: string;
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;
const sources = process.env.NEXT_PUBLIC_SEARCH_SOURCES;

export const SearchResultsComponent = (props: ArticleSearchResultsProps): JSX.Element => {
  const router = useRouter();
  const { sitecoreContext } = useSitecoreContext();

  const {
    widgetRef,
    actions: { onItemClick },
    queryResult: { isLoading, data: { content: articles = [] } = {} },
  } = useSearchResults<ArticleModel, InitialState>({
    query: (query: SearchResultsWidgetQuery) => {
      query
        .getRequest()
        .setSearchFilter(new FilterAnd([new FilterEqual('rfk_source.source_id', sources)]));
    },
    state: {
      sortType: 'featured_asc',
      page: 1,
      itemsPerPage: 10,
      keyphrase: props.defaultKeyphrase ?? '',
    },
  });

  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  // const selectedSortIndex = sortChoices.findIndex((s: any) => s.name === sortType);
  // const selectedFacetsFromApi = useSearchResultsSelectedFacets();
  if (isLoading) {
    return <div> Loading ... </div>;
  }

  function handleResultClick(
    e: MouseEvent<HTMLAnchorElement, MouseEvent>,
    result: ArticleModel,
    index: number
  ): void {
    e.preventDefault();
    if (result.url) {
      onItemClick({ id: result.id, index: index, sourceId: result.source_id });
      router.push(getLocalUrl(result.url) ?? '');
    }
  }
  if (sitecoreContext.pageEditing || !articles?.length)
    return (
      <div ref={widgetRef} className="search-results-container">
        <h1>
          Search Results for <span className="query"> {props.defaultKeyphrase} </span>
        </h1>
        <div className="no-results">{props.emptyMessage}</div>
      </div>
    );

  function getLocalUrl(url: string | undefined): string | undefined {
    if (url && process.env.NODE_ENV === 'development') {
      return url.replace('https://verticalsdemo-financial.vercel.app/', '/');
    }
    return url;
  }

  return (
    <div ref={widgetRef} className="search-results-container">
      {props.defaultKeyphrase && (
        <h1>
          Search Results for <span className="query"> {props.defaultKeyphrase} </span>
        </h1>
      )}
      {articles.map((result, index) => (
        <div key={index} className="result-item">
          <h2> {result.name}</h2>
          <p>{result.description}</p>
          <Link href="#" onClick={(e) => handleResultClick(e, result, index)}>
            Details
          </Link>
        </div>
      ))}
    </div>
  );
};
const SearchResultsStyledWidget = widget(
  SearchResultsComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);
export default SearchResultsStyledWidget;

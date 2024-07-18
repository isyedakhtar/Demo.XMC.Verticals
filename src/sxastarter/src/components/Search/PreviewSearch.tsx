import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { PreviewSearchInitialState, PreviewSearchWidgetQuery } from '@sitecore-search/react';
import { useRouter } from 'next/navigation';

import {
  FilterAnd,
  FilterEqual,
  PageController,
  WidgetDataType,
  usePreviewSearch,
  widget,
} from '@sitecore-search/react';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

type ArticleModel = {
  id: string;
  name: string;
  url: string;
  source_id?: string;
};

type InitialState = PreviewSearchInitialState<'itemsPerPage' | 'suggestionsList'>;

interface Props {
  defaultItemsPerPage: number;
}

export const PreviewSearch = ({ defaultItemsPerPage }: Props) => {
  const router = useRouter();

  function getLocalUrl(url: string | undefined): string | undefined {
    if (url && process.env.NODE_ENV === 'development') {
      return url.replace('https://verticalsdemo-financial.vercel.app/', '/');
    }
    return url;
  }

  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>();
  const sources = process.env.NEXT_PUBLIC_SEARCH_SOURCES;
  const { sitecoreContext } = useSitecoreContext();
  PageController.getContext().setLocale({ country: 'au', language: 'en' });
  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    queryResult: { isFetching, isLoading, data: { content: previewArticles = [] } = {} },
  } = usePreviewSearch<ArticleModel, InitialState>({
    query: (query: PreviewSearchWidgetQuery) => {
      query
        .getRequest()
        .setSearchFilter(new FilterAnd([new FilterEqual('rfk_source.source_id', sources)]));
    },
    state: {
      suggestionsList: [],
      itemsPerPage: defaultItemsPerPage,
    },
  });
  const loading = isLoading || isFetching;
  const keypharaseChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!sitecoreContext.pageEditing) {
        const keyphrase = e.target.value;
        setIsSearching(true);
        if (keyphrase.length === 0) setIsSearching(false);
        setSearch(keyphrase);
        onKeyphraseChange({ keyphrase: keyphrase });
      }
      const keyphrase = e.target.value;
      setIsSearching(true);
      if (keyphrase.length === 0) setIsSearching(false);
      setSearch(keyphrase);
      onKeyphraseChange({ keyphrase: keyphrase });
    },
    [onKeyphraseChange, sitecoreContext.pageEditing]
  );

  const handleBlur = () => {
    setTimeout(() => {
      setIsSearching(false);
    }, 110);
  };

  const inputFocus = () => {
    if (search.length >= 1) {
      setIsSearching(true);
    }
  };

  function handleSearchFormSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    window.location.href = `/en/search?q=${search}`;
    //router.push(`/en/search?q=${search}`);
  }

  function handleRedirect(article: ArticleModel, index: number): void {
    onItemClick({ id: article.id, index, sourceId: article.source_id });
    router.push(getLocalUrl(article.url) ?? '');
  }

  return (
    <div ref={widgetRef} className="search-container">
      <form onSubmit={handleSearchFormSubmit} onBlur={handleBlur} onFocus={inputFocus}>
        <input
          value={search}
          onChange={keypharaseChangeHandler}
          className="input-field"
          placeholder="search here..."
        />

        {!loading && isSearching && previewArticles && previewArticles?.length >= 1 && (
          <ul className="results-list">
            {previewArticles.map(
              (article, index) =>
                article.name && (
                  <li key={index} onClick={() => handleRedirect(article, index)}>
                    {article.name}
                  </li>
                )
            )}
          </ul>
        )}
      </form>
    </div>
  );
};
const PreviewSearchWidget = widget(PreviewSearch, WidgetDataType.PREVIEW_SEARCH, 'content');
export default PreviewSearchWidget;

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RecommendationWidgetQuery,
  useRecommendation,
  widget,
  WidgetDataType,
  RecommendationInitialState,
  FilterEqual,
  FilterAnd,
} from '@sitecore-search/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { MouseEvent } from 'react';

type ArticleModel = {
  id: string;
  name: string;
  author?: string;
  url?: string;
  description?: string;
  source_id?: string;
};

type RecommendationProps = {
  params: { [key: string]: string };
  title?: string;
  itemsToDisplay?: number;
};
type InitialState = RecommendationInitialState<'itemsPerPage'>;
//const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image';
const Images = [
  'https://edge.sitecorecloud.io/sitecore2b8f4-partnerdemo8ca0-dev5eb6-ccc8/media/Project/Verticals/Financial/Mockups/three-col-promo-1.png?h=303&iar=0&w=460',
  'https://edge.sitecorecloud.io/sitecore2b8f4-partnerdemo8ca0-dev5eb6-ccc8/media/Project/Verticals/Financial/Mockups/three-col-promo-2.png?h=303&iar=0&w=460',
  'https://edge.sitecorecloud.io/sitecore2b8f4-partnerdemo8ca0-dev5eb6-ccc8/media/Project/Verticals/Financial/Mockups/three-col-promo-3.png?h=303&iar=0&w=460',
];
const sources = process.env.NEXT_PUBLIC_SEARCH_SOURCES;

const Recommendations = (props: RecommendationProps) => {
  const router = useRouter();
  const sitecoreContext = useSitecoreContext().sitecoreContext;

  const {
    widgetRef,
    actions: { onItemClick },
    queryResult: { isLoading, isFetching, data: { content: recommendations = [] } = {} },
  } = useRecommendation<ArticleModel, InitialState>({
    query: (query: RecommendationWidgetQuery) => {
      query
        .getRequest()
        .setSearchFilter(new FilterAnd([new FilterEqual('rfk_source.source_id', sources)]));
    },
    state: {
      itemsPerPage: props.itemsToDisplay ?? 5,
    },
  });

  const loading = isLoading || isFetching;
  const handleResultClick = (
    e: MouseEvent<HTMLAnchorElement>,
    result: ArticleModel,
    index: number
  ): void => {
    e.preventDefault();
    onItemClick({ id: result.id, index: index, sourceId: result.source_id });
    router.push(result.url ?? '');
  };

  if (sitecoreContext.pageEditing) {
    return <div>[Placeholder for recommendations. Search recommendations will display here]</div>;
  }

  return (
    <div
      ref={widgetRef}
      className={`component component-spaced recommendations ${props.params.styles.trimEnd()}`}
    >
      <div className="container">
        <div className="row">
          {!loading &&
            recommendations.map((result, index) => (
              <div key={index} className="col-sm-12 col-lg-4 fade-section is-visible">
                <div className="recommendation-card">
                  <img src={Images[index]} alt={result.name} />
                  <h2>{result.name}</h2>
                  <p>{result.description}</p>
                  <Link
                    className={`button button-main`}
                    href="#"
                    onClick={(e) => handleResultClick(e, result, index)}
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationsWidget = widget(Recommendations, WidgetDataType.RECOMMENDATION, 'content');
export default RecommendationsWidget;

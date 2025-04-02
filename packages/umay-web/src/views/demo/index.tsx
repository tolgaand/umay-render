import { useParams } from "react-router-dom";
import DemoListView from "./DemoListView";
import DemoDetailView from "./DemoDetailView";
import { Helmet } from "react-helmet-async";

export default function DemoView() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>{id ? `Umay Render Demo: ${id}` : "Umay Render Demos"}</title>
        <meta
          name="description"
          content={
            id
              ? `View the ${id} demo from Umay Render - see how HTML to PDF conversion works in action.`
              : "Browse Umay Render demos and examples for HTML to PDF and HTML to image conversions."
          }
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://www.umayrender.com/demos${id ? `/${id}` : ""}`}
        />
      </Helmet>
      {id ? <DemoDetailView /> : <DemoListView />}
    </>
  );
}

import { Navigate, useParams } from "react-router-dom";
import { shopPath } from "../utils/shopLinks";

/** Old collection URLs redirect into the filtered shop page. */
export default function CollectionRedirect() {
  const { slug } = useParams();
  return <Navigate to={shopPath(slug || "")} replace />;
}

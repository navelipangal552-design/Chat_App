import { LoaderIcon } from "lucide-react";

//full-screen loading indicator.
/*
It is typically shown when:

The app is fetching initial data

The user is waiting for authentication

A page transition is still loading */
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  );
}
export default PageLoader;
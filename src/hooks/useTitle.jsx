import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useTitle = (title='') => {
  const { pathname } = useLocation();
  const pageTitle = pathname.split("/").pop();

    useEffect(() => {
        // document.title = `${title? title: 'Welcome'} | Academic Portal`;
        document.title = `${title ? title : pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)} | FYP Management Portal`;
    }, [title, pageTitle]);
  return null}

export default useTitle
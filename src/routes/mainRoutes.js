import React from "react";
import MainPage from "../pages/Home/mainjs/MainPage";
import Notification from "../pages/Home/mainjs/Notification";
import TogetherList from "../pages/Post/Together/TogetherList";
import TogetherCreate from "../pages/Post/Together/TogetherCreate";
import TogetherDetail from "../pages/Post/Together/TogetherDetail";
import ShareList from "../pages/Post/Share/ShareList";
import ShareCreate from "../pages/Post/Share/ShareCreate";
import ShareDetail from "../pages/Post/Share/ShareDetail";


const mainRoutes = [
  { path: "/main", element: <MainPage /> },
  { path: "/notification", element: <Notification /> },
  { path: "/togetherlist", element: <TogetherList /> },
  { path: "/togethercreate", element: <TogetherCreate /> },
  { path: "/togetherdetail/:id", element: <TogetherDetail/>},
  { path: "/sharecreate", element: <ShareCreate/>},
  { path: "/sharelist", element: <ShareList/>},
  { path: "/sharedetail/:id", element: <ShareDetail/>},

];

export default mainRoutes;
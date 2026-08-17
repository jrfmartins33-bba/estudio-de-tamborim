/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as EscolasRouteImport } from './routes/escolas'
const IndexRoute=IndexRouteImport.update({id:'/',path:'/',getParentRoute:()=>rootRouteImport} as any)
const EscolasRoute=EscolasRouteImport.update({id:'/escolas',path:'/escolas',getParentRoute:()=>rootRouteImport} as any)
export interface FileRoutesByFullPath{'/':typeof IndexRoute;'/escolas':typeof EscolasRoute}
export interface FileRoutesByTo{'/':typeof IndexRoute;'/escolas':typeof EscolasRoute}
export interface FileRoutesById{__root__:typeof rootRouteImport;'/':typeof IndexRoute;'/escolas':typeof EscolasRoute}
export interface FileRouteTypes{fileRoutesByFullPath:FileRoutesByFullPath;fullPaths:'/'|'/escolas';fileRoutesByTo:FileRoutesByTo;to:'/'|'/escolas';id:'__root__'|'/'|'/escolas';fileRoutesById:FileRoutesById}
export interface RootRouteChildren{IndexRoute:typeof IndexRoute;EscolasRoute:typeof EscolasRoute}
declare module '@tanstack/react-router'{interface FileRoutesByPath{'/':{id:'/';path:'/';fullPath:'/';preLoaderRoute:typeof IndexRouteImport;parentRoute:typeof rootRouteImport};'/escolas':{id:'/escolas';path:'/escolas';fullPath:'/escolas';preLoaderRoute:typeof EscolasRouteImport;parentRoute:typeof rootRouteImport}}}
const rootRouteChildren:RootRouteChildren={IndexRoute,EscolasRoute};export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type {getRouter} from './router.tsx';import type {startInstance} from './start.ts';declare module '@tanstack/react-start'{interface Register{ssr:true;router:Awaited<ReturnType<typeof getRouter>>;config:Awaited<ReturnType<typeof startInstance.getOptions>>}}

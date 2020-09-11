import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'  
import Home from './pages/home'
import TempDetail from './pages/temp-detail'
import TitleFill from './pages/title-fill'
import Workbench from './pages/workbench'
import { UploadProvider, UploadContext } from './pages/workbench/uses/useUpload'
import Result from './pages/result'
import Preview from './pages/preview'
import Demo from './pages/demo'

function RouteAuth(props) {
    if (!props.location || !props.location.state) {
      return  <Redirect to="/" from='*' exact /> 
    }
    const Component = props.component
    return <Component {...props}></Component>
}

ReactDOM.render((
  <UploadProvider>
      <Router forceRefresh={false}>
        <Switch >
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/tempdetail" render={(props) => {
              return  <RouteAuth {...props} component={TempDetail}></RouteAuth>
            }} />
            <Route path="/titlefill" render={(props) => {
              return  <RouteAuth {...props} component={TitleFill}></RouteAuth>
            }} >
            </Route>
            <Route path="/workbench" render={(props) => {
              return  <RouteAuth {...props} component={Workbench}></RouteAuth>
            }}>
            </Route>
            <Route path="/result" render={(props) => {
                return <Result />
            }}>
            </Route>
            <Route path="/preview" render={(props) => {
                return  <RouteAuth {...props} component={Preview}></RouteAuth>
            }}>
            </Route>
            <Route path="/demo" render={() => {
              return <Demo />
            }}>
            </Route>
            <Redirect to="/" from='*' exact /> 
        </Switch>
      </Router>
    </UploadProvider>
),  document.getElementById('root'))
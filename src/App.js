import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import AuthContext from "./contexts/auth";
import SignIn from "./pages/SignIn/SignIn";
import themes from "./themes";
import "materialize-css/dist/css/materialize.min.css";
import Surveys from "./pages/Surveys";
import SignUp from "./pages/SignUp/SignUp";
import Results from "./pages/Results";
import ResultsUser from "./pages/ResultsUser";
import Survey from "./pages/Survey";
import CreateSurvey from "./pages/CreateSurvey";
import CreateResult from "./pages/CreateResult";
import AdminRoute from "./components/ProtectedRoutes/adminProtected";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "materialize-css";
import { URL_ROOT, URL_CREATE, URL_REGISTER, URL_LOGIN, URL_SURVEY, URL_RESULTS,URL_RESULTS_USER, URL_EDIT,URL_CREATE_RESULT } from "./utils/constants";
import EditSurvey from './pages/EditSurvey/index';

function App() {
  const [user, setUser] = useState({ isLoggedIn: false });
  useEffect(() => {
    let userStorage = localStorage.getItem("user");
    if (userStorage) {
      userStorage = JSON.parse(userStorage);
      setUser(userStorage);
    }
  }, []);

  return (
    <ThemeProvider theme={themes}>
      <AuthContext.Provider value={{ user, setUser }}>
        <Router basename={URL_ROOT}>
          <Switch>
            <AdminRoute path={URL_CREATE} component={CreateSurvey} />
            <AdminRoute path={URL_CREATE_RESULT} component={CreateResult} />
            <Route exact path={`${URL_SURVEY}/:surveyId/complete`} component={Survey} />
            <Route exact path={`${URL_SURVEY}/:surveyId`} component={Survey} />
            <Route exact path={`${URL_EDIT}/edit/:surveyId`} component={EditSurvey} />
            <Route
              exact
              path={`${URL_SURVEY}/:surveyId/questions/:questionId`}
              component={Survey}
            />
            <Route path={URL_REGISTER} component={SignUp} />
            <Route path={`${URL_RESULTS}/:id`} component={Results} exact />
            <Route path={`${URL_RESULTS_USER}/:id/:sur`} component={ResultsUser} exact />
            <Route path={URL_LOGIN} component={SignIn} />
            <Route path={URL_ROOT} component={Surveys} />
          </Switch>
        </Router>
        <ToastContainer />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;

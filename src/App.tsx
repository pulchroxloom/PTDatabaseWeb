import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import About from './components/pages/About';
import PTList from './components/pages/PTList';
import GeneralInfo from './components/pages/GeneralInfo';
import InputLabs from './components/pages/InputLabs';
import InputSchedule from './components/pages/InputSchedule';
import Profile from './components/pages/Profile';
import firebase, { db } from './firebase'
import './styles/App.scss';

function App() {
  const [user, setUser] = React.useState<firebase.User | null>(null);
  const [userData, setUserData] = React.useState<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null>(null);

  React.useEffect(() => {
    let user = firebase.auth().currentUser
    if (user) {
      setUser(user)
      db.collection('users').doc(user.uid).get()
        .then(doc => setUserData(doc))
        .catch(error => console.error(error))
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar user={user} setUser={setUser} userData={userData} setUserData={setUserData} />
        </header>
        <Route exact path="/" render={props => (
          <>
            <GeneralInfo />
            <PTList />
          </>
        )} />
        <Route path="/about" component={About} />
        <Route path="/input-labs" render={props => (
          <InputLabs {...props} permissionToView={userData?.data()?.roles.includes('leader')} />
          )} />
        <Route path="/input-schedule" render={props => (
          <InputSchedule {...props} permissionToView={userData?.data()?.roles.includes('peer-teacher')} />
          )} />
        <Route path="/profile" component={Profile} />
      </div>
    </Router>
  );
}

export default App;

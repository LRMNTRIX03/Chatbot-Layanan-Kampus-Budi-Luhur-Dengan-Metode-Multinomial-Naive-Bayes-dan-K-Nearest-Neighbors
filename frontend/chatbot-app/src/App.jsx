import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './features/pages/admin/Dashboard.jsx';
import AdminLayouts from './Layouts/AdminLayouts.jsx';
import IntentIndex from './features/pages/admin/Intent/IntentIndex.jsx';
import IntentCreate from './features/pages/admin/Intent/IntentCreate.jsx';
import IntentEdit from './features/pages/admin/Intent/IntentEdit.jsx';
import PatternIndex from './features/pages/admin/Pattern/PatternIndex.jsx';
import PatternCreate from './features/pages/admin/Pattern/PatternCreate.jsx';
import LoginPage from './features/pages/auth/LoginPage.jsx';
import PrivateRoute from './features/components/Admin/PrivateRoute.jsx';
import Unauthorized from './features/components/Unauthorized.jsx';
import UserLayouts from './Layouts/UserLayouts.jsx';
import DashboardUser from './features/pages/user/DashboardUser.jsx';
import PatternEdit from './features/pages/admin/Pattern/PatternEdit.jsx';
import ResponseIndex from './features/pages/admin/Response/ResponseIndex.jsx';
import ResponseCreate from './features/pages/admin/Response/ResponseCreate.jsx';
import ResponseEdit from './features/pages/admin/Response/ResponseEdit.jsx';
import TrainingPage from './features/pages/admin/Training/TrainingPage.jsx';
import { useUserStore } from './features/store/useUserStore.js';
import LayananPage from './features/pages/user/LayananPage.jsx';
import TFIDFIndex from './features/pages/admin/Bow/TfidfIndex.jsx';
import PreprocessingIndex from './features/pages/admin/Preprocessing/PreprocessingIndex.jsx';
import StopwordsIndex from './features/pages/admin/Stopwords/StopwordIndex.jsx';
import StopwordsCreate from './features/pages/admin/Stopwords/StopwordsCreate.jsx';
import StopwordsEdit from './features/pages/admin/Stopwords/StopwordsEdit.jsx';
import SlangwordsIndex from './features/pages/admin/Slangwords/SlangwordsIndex.jsx';
import SlangwordsCreate from './features/pages/admin/Slangwords/SlangwordsCreate.jsx';
import SlangwordsEdit from './features/pages/admin/Slangwords/SlangwordsEdit.jsx';
import RiwayatIndex from './features/pages/admin/RiwayatTraining/RiwayatIndex.jsx';
function App() {
  
const {user} = useUserStore();
console.log("User in App.jsx:", user);
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayouts />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="intent" element={<IntentIndex />} />
            <Route path="intent/create" element={<IntentCreate />} />
            <Route path="intent/edit/:id" element={<IntentEdit />} />
            <Route path="pattern" element={<PatternIndex />} />
            <Route path="pattern/create" element={<PatternCreate />} />
            <Route path="pattern/edit/:id" element={<PatternEdit />}/>
            <Route path="response" element={<ResponseIndex/>}/>
            <Route path="response/create" element={<ResponseCreate/>}/>
            <Route path="response/edit/:id" element={<ResponseEdit/>}/>
            <Route path="training" element={<TrainingPage/>}/>
            <Route path='tfidf' element={<TFIDFIndex/>}/>
            <Route path='preprocessing' element={<PreprocessingIndex/>}/>
            <Route path='stopwords' element={<StopwordsIndex/>}/>
            <Route path='stopwords/create' element={<StopwordsCreate/>}/>
            <Route path='stopwords/edit/:id' element={<StopwordsEdit/>}/>
            <Route path='slangwords' element={<SlangwordsIndex/>}/>
            <Route path='slangwords/create' element={<SlangwordsCreate/>}/>
            <Route path='slangwords/edit/:id' element={<SlangwordsEdit/>}/>
            <Route path='riwayat' element={<RiwayatIndex/>}/>
            {/* <Route path='slangwords' element={<SlangwordsIndex/>}/> */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Route>
        </Route>

        
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path='/' element={<UserLayouts />}>


          <Route path="dashboard" element={<DashboardUser />} />
          <Route path="*" element={<h1>404 - Not Found</h1>} />
          <Route path="layanan" element={<LayananPage/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

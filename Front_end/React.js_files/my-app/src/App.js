
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/Usercontext';
import { MessageProvider } from './context/MessageContext';
import MessageBox from './components/MessageBox';
import BloodLink from './BloodLink'; 
import LoginRegister from './LoginRegister'; 
import Learnmore from './Learnmore';
import DeliveryPartner from './DeliveryPartner'; 
import DonorandReceiptent from './DonorandReceiptent'; 
import PreBloodGroupForm from './PreBloodGroupForm';
import BookDonationSlot from './BookDonationSlot';
import DonorFeedback from './DonorFeedback';
import BloodDonationForm from './BloodDonationForm';
import EmergencyButton from './EmergencyButton';
import RequestBlood from './RequestBlood';
import FindDonors from './FindDonors';
import BloodTypeDetector from './BloodTypeDetector';
import BloodStock from './BloodStock';
import ForgotPassword from './ForgotPassword';
import DonorPage from './DonorPage';
import RecipientPage from './RecipientPage';
import './App.css';
import 'leaflet/dist/leaflet.css';
import DonorHistory from './DonorHistory';
import RecipientFeedback from './RecipientFeedback';
import ProtectedRoute from './ProtectedRoute';
import TermsAndConditions from './TermsandConditions';
import Tracking from './Tracking';
import FAQ from './FAQ';
import PrivacyPolicy from './PrivacyPolicy';
import ResetPassword from './ResetPassword';
import ForgotPassword2 from './ForgotPassword2';
import Accept from './Accept';
import GPSPermissionPopup from './GPSPermissionPopup';




const App = () => {
    return (
   
    <UserProvider>
      <MessageProvider>
        <Router>
            <Routes>
              
   <Route path="/" element={<BloodLink/>}/>
     <Route path="/Learnmore" element={<Learnmore/>} />
     <Route path="/LoginRegister" element={<LoginRegister/>}/>
  <Route path="/donor-and-receiptent" element={<DonorandReceiptent/>}/>
  <Route path="/DeliveryPartner" element={<DeliveryPartner/>}/>
<Route path="/PreBloodGroupForm" element={<PreBloodGroupForm/>}/>
 <Route path="/BookDonationSlot" element={<BookDonationSlot/>} />
 <Route path="/DonorFeedback" element={<DonorFeedback/>} />
 <Route path="/BloodDonationForm" element={<BloodDonationForm/>}/>
<Route path="/EmergencyButton" element={<EmergencyButton/>}/>
<Route path="/RequestBlood" element={<RequestBlood/>}/>
<Route path="/FindDonors" element={<FindDonors/>}/>
<Route path="/BloodTypeDetector" element={<BloodTypeDetector/>}/>
<Route path="/BloodStock" element={<BloodStock/>}/>
<Route path='/ForgotPassword' element={<ForgotPassword/>}/>
<Route path='/ForgotPassword2' element={<ForgotPassword2/>}/>
<Route path='/DonorHistory' element={<ProtectedRoute><DonorHistory/></ProtectedRoute>} />
<Route path='/DonorPage' element={<ProtectedRoute><DonorPage/></ProtectedRoute>} />
<Route path="/RecipientPage" element={<ProtectedRoute><RecipientPage/></ProtectedRoute>} />
<Route path="/RecipientFeedback" element={<RecipientFeedback/>}/>
<Route path="/TermsandConditions" element={<TermsAndConditions/>}/>
<Route path="/Tracking" element={<Tracking/>}/>
<Route path="/Accept" element={<Accept/>}/>
<Route path="/FAQ" element={<FAQ/>}/>
<Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>
  <Route path="/ResetPassword" element={<ResetPassword/>}/>
 <Route path='/GPSPermissionPopup' element={<GPSPermissionPopup/>}/>
            </Routes>
    
      
        </Router>
        <MessageBox />
      </MessageProvider>
    </UserProvider>

    )
}

export default App; 

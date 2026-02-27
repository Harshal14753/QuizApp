import './App.css'
import { Routes, Route } from "react-router";
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminUpdateUser from './pages/Admin/AdminUpdateUser';import AdminProfile from './pages/Admin/AdminProfile';import QuizQuestion from './pages/Admin/QuizQuestion';
import AddQuestion from './pages/Admin/AddQuestion';
import QuizLeaderboard from './pages/Admin/QuizLeaderboard';import BasicItem from './pages/Admin/BasicItem';import ProtectedUserRoute from './components/ProtectedUserRoute'
import QuizPlay from './pages/QuizPlay'
import PlayQuiz from './pages/PlayQuiz'
import ProtectedAdminRoute, { PublicAdminRoute } from './components/ProtectedAdminRoute';

function App() {
  return (
    <>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home"            element={
          <ProtectedUserRoute><Home /></ProtectedUserRoute>
        } />
        <Route path="/quiz-type/:quizType" element={
          <ProtectedUserRoute><QuizPlay /></ProtectedUserRoute>
        } />
        <Route path="/play-quiz" element={
          <ProtectedUserRoute><PlayQuiz /></ProtectedUserRoute>
        } />

        {/* ── Admin auth ── */}
        <Route path="/admin/login" element={
          <PublicAdminRoute><AdminLogin /></PublicAdminRoute>
        } />

        {/* ── Admin pages ── */}
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>
        } />
        <Route path="/admin/users/:id/edit" element={
          <ProtectedAdminRoute><AdminUpdateUser /></ProtectedAdminRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>
        } />

        {/* Quiz Questions  →  /admin/:quizType/questions  */}
        {/* quizType values: practice-quiz | normal-quiz | audio-quiz | video-quiz | true-false | daily-quiz | fear-factor */}
        <Route path="/admin/:quizType/questions" element={
          <ProtectedAdminRoute><QuizQuestion /></ProtectedAdminRoute>
        } />
        <Route path="/admin/:quizType/questions/add" element={
          <ProtectedAdminRoute><AddQuestion /></ProtectedAdminRoute>
        } />
        <Route path="/admin/:quizType/questions/:id/edit" element={
          <ProtectedAdminRoute><AddQuestion /></ProtectedAdminRoute>
        } />

        {/* Quiz Leaderboards  →  /admin/:quizType/leaderboard  */}
        <Route path="/admin/:quizType/leaderboard" element={
          <ProtectedAdminRoute><QuizLeaderboard /></ProtectedAdminRoute>
        } />

        {/* Basic Items  →  /admin/basic-items/:basicItem  */}
        {/* basicItem values: category | skills | classification | level | avatar */}
        <Route path="/admin/basic-items/:basicItem" element={
          <ProtectedAdminRoute><BasicItem /></ProtectedAdminRoute>
        } />
      </Routes>
    </>
  )
}

export default App

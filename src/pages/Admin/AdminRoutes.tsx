// AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import AdminHome from './AdminHome'
import AdminSermonsList from './AdminSermonsList'
import AdminEventsList from './AdminEventsList'
import AdminBlogList from './AdminBlogList'
import AdminGallery from './AdminGallery'
import AdminAnnouncements from './AdminAnnouncements'
import AdminRegistrations from './AdminRegistrations'
import AdminServiceTimes from './AdminServiceTimes'
import AdminMinistryDetails from './AdminMinistryDetails'

const AdminRoutes = () => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      >
        <Route
          index
          element={<AdminHome />}
        />
        <Route
          path="sermons/video"
          element={<AdminSermonsList type="video" />}
        />
        <Route
          path="sermons/audio"
          element={<AdminSermonsList type="audio" />}
        />
        <Route
          path="events"
          element={<AdminEventsList />}
        />
        <Route
          path="blog"
          element={<AdminBlogList />}
        />
        <Route
          path="gallery"
          element={<AdminGallery />}
        />
        <Route
          path="announcements"
          element={<AdminAnnouncements />}
        />
        <Route
          path="registrations"
          element={<AdminRegistrations />}
        />
        <Route
          path="service-times"
          element={<AdminServiceTimes />}
        />
        <Route
          path="ministries"
          element={<AdminMinistryDetails />}
        />
        <Route
          path="*"
          element={<Navigate to="/admin" />}
        />
      </Route>
    </Routes>
  )
}

export default AdminRoutes

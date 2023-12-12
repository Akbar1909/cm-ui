import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import PrivateRoute from 'components/privateRoute';

const RolesPage = lazy(() => import('pages/RolesPage'));
const ClientsPage = lazy(() => import('pages/ClientsPage'));
const AddClientPage = lazy(() => import('pages/AddClientPage'));
const EditClientPage = lazy(() => import('pages/EditClientPage'));
const UserPage = lazy(() => import('pages/UsersPage'));
const AddUserPage = lazy(() => import('pages/AddUserPage'));
const EditUserPage = lazy(() => import('pages/EditUserPage'));
const LoginPage = lazy(() => import('pages/LoginPage'));
const DashboardPage = lazy(() => import('pages/DashboardPage'));
const TicketsPage = lazy(() => import('pages/TicketsPage'));
const AddTicketPage = lazy(() => import('pages/AddTicketPage'));
const EditTicketPage = lazy(() => import('pages/EditTicketPage'));
const ClientTicketsViewPage = lazy(() => import('pages/ClientTicketsViewPage'));
const SettingsPage = lazy(() => import('pages/SettingsPage'));
const OrganizationsPage = lazy(() => import('pages/OrganizationsPage'));
const ProjectsPage = lazy(() => import('pages/ProjectsPage'));
const AddProjectPage = lazy(() => import('pages/AddProjectPage'));
const EditProjectPage = lazy(() => import('pages/EditProjectPage'));
const AddOrganizationPage = lazy(() => import('pages/AddOrganizationPage'));
const EditOrganizationPage = lazy(() => import('pages/EditOrganizationPage'));

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
      index: true
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'user/add', element: <AddUserPage /> },
        { path: 'user/edit/:id', element: <EditUserPage /> },
        {
          path: 'tickets',
          element: <TicketsPage />
        },
        { path: 'tickets/add', element: <AddTicketPage /> },
        { path: 'tickets/edit/:id', element: <EditTicketPage /> },
        { path: 'clients', element: <ClientsPage /> },
        { path: 'clients/add', element: <AddClientPage /> },
        { path: 'clients/edit/:id', element: <EditClientPage /> },
        {
          path: 'clients/view/tickets/:id',
          element: <ClientTicketsViewPage />
        },
        { path: 'roles', element: <RolesPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'organizations', element: <OrganizationsPage /> },
        { path: 'organizations/add', element: <AddOrganizationPage /> },
        { path: 'organizations/edit/:id', element: <EditOrganizationPage /> },
        { path: 'projects', element: <ProjectsPage /> },
        { path: 'projects/add', element: <AddProjectPage /> },
        { path: 'projects/edit/:id', element: <EditProjectPage /> }
      ]
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '*', element: <Navigate to="/" /> }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/dashboard/app" replace />
    }
  ]);

  return routes;
}

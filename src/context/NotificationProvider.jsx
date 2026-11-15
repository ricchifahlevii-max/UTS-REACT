import NotificationContext from './NotificationContext.jsx'
import { useToast } from '../hooks/useToast.jsx'

export default function NotificationProvider({ children }) {
  const { notify } = useToast()
  return <NotificationContext.Provider value={{ notify }}>{children}</NotificationContext.Provider>
}

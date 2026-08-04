import { Navigate } from 'react-router-dom'

// Zoznam pobočiek teraz žije priamo na /kontakt – starý odkaz presmerujeme.
export default function Branches() {
  return <Navigate to="/kontakt" replace />
}

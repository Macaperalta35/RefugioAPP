import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toastMsg } = useApp()
  if (!toastMsg) return null
  return <div className="toast">{toastMsg}</div>
}

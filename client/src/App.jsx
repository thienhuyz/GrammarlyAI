import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />


      <div className="min-h-screen " >
        <AppRoutes />
      </div>
    </>
  )
}
//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
export default App

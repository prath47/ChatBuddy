import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { logout, setUser } from '../redux/UserSlice'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log('redux user', user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios.get(URL, { withCredentials: true });

      dispatch(setUser(response.data.data))
      
      if (response.data.data.logout) {
        dispatch(logout())
        navigate('/email')
      }

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  return (
    <div>
      Home

      {/* messege components */}
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Home
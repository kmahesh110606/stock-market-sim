import { createBrowserRouter, RouterProvider } from 'react-router'

import Login from './login/page'
import Stock from './stock/page'
import Register from './login/register'


const App = () => {
	return (
		<>
			<Navbar />
			<main>
				<RouterProvider router={createBrowserRouter([
					{ path: "/login/", Component: Login },
					{ path: "/stocks/", Component: Stock },
					{ path: "/register/", Component: Register }
				])} />
			</main>
		</>
	)
}

const Navbar = () => {
	return (
		<nav>

		</nav>
	)
}

export default App

import React from "react";
import { Navbar } from "flowbite-react";
import { useSelector } from 'react-redux'
import SearchField from "./search"
import AvatarField from "./Avatar";

export default function Navigation() {
  
  const currentUser = useSelector((state) => state.storageData.users.username)
  return (
    <Navbar
      fluid={true}
      rounded={true}
      menuOpen={false}
    >
      <Navbar.Brand href="/">
        <img
          src="/icon.png"
          className="mr-3 h-6 sm:h-9"
          alt="VideoSRV Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          VideoSRV
        </span>
      </Navbar.Brand>
      <SearchField></SearchField>
      <AvatarField user={currentUser} ></AvatarField>
    </Navbar>

  )
}
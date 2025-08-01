import React from 'react'
import EditorNavbar from '../components/EditorNavbar'
import { Outlet } from 'react-router-dom'

export default function ProyectsLayout() {
  return (
    <>
      <EditorNavbar title='' />
      <main>
        <Outlet/>
      </main>
    </>
  )
}

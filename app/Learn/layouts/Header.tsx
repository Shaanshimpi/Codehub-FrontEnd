import { getLanguages } from "@/lib/getData"
import { Language } from "../types/TutorialTypes"
import HeaderClient from "./HeaderClient"

interface HeaderProps {
  className?: string
}

const Header = async ({ className }: HeaderProps) => {
  const languages: Language[] = await getLanguages()

  return <HeaderClient className={className} languages={languages} />
}

export default Header

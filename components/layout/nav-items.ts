// Âncoras absolutas (com "/") para que o menu funcione a partir de qualquer
// página — inclusive /blog e /faq, não só da home.
export const navItems = [
  { name: 'Clínicas', href: '/#portas' },
  { name: 'Academias', href: '/#portas' },
  { name: 'Empresas', href: '/#portas' },
  { name: 'Programas', href: '/#programas' },
  { name: 'Como funciona', href: '/#como-funciona' },
  { name: 'Conformidade', href: '/#conformidade' },
]

export type NavItem = (typeof navItems)[number]

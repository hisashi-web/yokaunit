"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index === 0 ? (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600"
                onClick={() => window.scrollTo(0, 0)}
              >
                <Home className="w-4 h-4 mr-1" />
                {item.label}
              </Link>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  href={item.href}
                  className="ml-1 md:ml-2 text-sm text-gray-500 hover:text-blue-600"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {item.label}
                </Link>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

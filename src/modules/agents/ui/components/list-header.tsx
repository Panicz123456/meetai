'use client'

import { PlusIcon, XCircleIcon } from "lucide-react"
import { useState } from "react"

import { DEFAULT_PAGE } from "@/constants"
import { Button } from "@/components/ui/button"

import { NewAgentsDialog } from "./new-agents-dialog"
import { AgentsSearchFilter } from "./agents-search-filter"
import { useAgentsFilter } from "../../hooks/use-agents-filter"


export const ListHeader = () => {
  const [filters, setFilters] = useAgentsFilter()
  const [open, onOpenChange] = useState(false)

  const isAnyFilterModified = !!filters.search

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE
    })
  }

  return (
    <>
      <NewAgentsDialog open={open} onOpenChange={onOpenChange} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Agents</h5>
          <Button onClick={() => onOpenChange(true)}>
            <PlusIcon />
            New Agents
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter /> 
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon className="size-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
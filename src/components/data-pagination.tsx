import { Button } from "@/components/ui/button"

interface Props {
  page: number,
  totalPage: number,
  onPageChanges: (page: number) => void
}

export const DataPagination = ({
  page,
  totalPage,
  onPageChanges
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPage || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page === 1}
          variant="outline"
          size="sm"
          onClick={() => onPageChanges(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPage || totalPage === 0}
          variant="outline"
          size="sm"
          onClick={() => onPageChanges(Math.min(totalPage, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
export function useDate() {
  const formatDate = (dateStr: string, opts?: Intl.DateTimeFormatOptions) =>
    new Date(dateStr).toLocaleDateString('en-US', opts ?? {
      month: 'long', day: 'numeric', year: 'numeric',
    })

  const formatShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

  return { formatDate, formatShort }
}
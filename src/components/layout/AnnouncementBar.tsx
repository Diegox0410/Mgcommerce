import { useStoreConfigStore } from '../../stores/store-config-store'

export function AnnouncementBar() {
  const announcement = useStoreConfigStore((state) => state.config.announcement)
  if (!announcement.enabled || !announcement.text) return null
  return <div className="announcement">{announcement.href ? <a href={announcement.href}>{announcement.text}</a> : announcement.text}</div>
}

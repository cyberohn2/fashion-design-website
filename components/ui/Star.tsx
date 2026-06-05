type StarProps = {
  type?: string,
  className?: string,
  gradId?: string
}

const Star = ({ type = "full", className = "w-4 h-4 text-yellow-500" , gradId } : StarProps) => {
  // type: "full" | "half" | "empty"
  if (type === "empty") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
          d="M12 17.3L7.3 20l1.1-5.1L4 11.6l5.2-.5L12 6l2.8 5.1 5.2.5-4.4 3.3L16.7 20 12 17.3z" />
      </svg>
    )
  }

  if (type === "half") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradId})`} d="M12 17.3L7.3 20l1.1-5.1L4 11.6l5.2-.5L12 6l2.8 5.1 5.2.5-4.4 3.3L16.7 20 12 17.3z" />
        <path stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
          d="M12 17.3L7.3 20l1.1-5.1L4 11.6l5.2-.5L12 6l2.8 5.1 5.2.5-4.4 3.3L16.7 20 12 17.3z" />
      </svg>
    )
  }

  // full
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.3L7.3 20l1.1-5.1L4 11.6l5.2-.5L12 6l2.8 5.1 5.2.5-4.4 3.3L16.7 20 12 17.3z" />
    </svg>
  )
}

export default Star

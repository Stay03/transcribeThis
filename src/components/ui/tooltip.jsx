import * as React from "react"
import { cn } from "../../lib/utils"

const Tooltip = React.forwardRef(({ children, content, side = "right", className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef(null)
  const tooltipRef = React.useRef(null)

  const showTooltip = (event) => {
    setIsVisible(true)
    const rect = event.currentTarget.getBoundingClientRect()
    const tooltipRect = tooltipRef.current?.getBoundingClientRect()
    
    let x, y
    
    switch (side) {
      case "top":
        x = rect.left + rect.width / 2
        y = rect.top - 8
        break
      case "bottom":
        x = rect.left + rect.width / 2
        y = rect.bottom + 8
        break
      case "left":
        x = rect.left - 8
        y = rect.top + rect.height / 2
        break
      case "right":
      default:
        x = rect.right + 8
        y = rect.top + rect.height / 2
        break
    }
    
    setPosition({ x, y })
  }

  const hideTooltip = () => {
    setIsVisible(false)
  }

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none transform transition-all duration-200"
    
    switch (side) {
      case "top":
        return cn(baseClasses, "translate-x-[-50%] translate-y-[-100%]", className)
      case "bottom":
        return cn(baseClasses, "translate-x-[-50%]", className)
      case "left":
        return cn(baseClasses, "translate-x-[-100%] translate-y-[-50%]", className)
      case "right":
      default:
        return cn(baseClasses, "translate-y-[-50%]", className)
    }
  }

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
        ...children.props
      })}
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          style={{
            left: position.x,
            top: position.y,
            opacity: isVisible ? 1 : 0,
          }}
          {...props}
        >
          {content}
        </div>
      )}
    </>
  )
})

Tooltip.displayName = "Tooltip"

export { Tooltip }
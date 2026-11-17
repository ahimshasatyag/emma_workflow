import { useState } from "react"
import { useTaskStore } from "../stores/taskStore"

/**
 * Hook custom untuk interaksi Drag and Drop kolom Kanban
 */
export function useDragAndDrop(onMoveTask) {
  const { draggedTaskId, setDraggedTaskId } = useTaskStore()
  const [activeOverColumn, setActiveOverColumn] = useState(null)

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
    setDraggedTaskId(taskId)
  }

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (activeOverColumn !== columnStatus) {
      setActiveOverColumn(columnStatus)
    }
  }

  const handleDragLeave = (e, columnStatus) => {
    if (activeOverColumn === columnStatus) {
      setActiveOverColumn(null)
    }
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    setActiveOverColumn(null)
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId
    if (taskId && targetStatus) {
      onMoveTask({ id: taskId, newStatus: targetStatus })
    }
    setDraggedTaskId(null)
  }

  const handleDragEnd = () => {
    setActiveOverColumn(null)
    setDraggedTaskId(null)
  }

  return {
    draggedTaskId,
    activeOverColumn,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  }
}

// components/tasks/TasksCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../../App";
import { ColorConstants } from "../../AppStyles";

interface TaskCardProps {
  task: Task;
  onSelectTask: (task: Task) => void;
}

const statusColors: Record<Task["status"], string> = {
  Pending: "#F1C40F",
  Accepted: "#2980B9",
  Completed: "#2ECC71",
  Rejected: "#E74C3C",
  Overdue: "#5d75c4ff",
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelectTask }) => {
  const badgeColor = statusColors[task.status] ?? "#BDC3C7";

  return (
    <TouchableOpacity
      onPress={() => onSelectTask(task)}
      activeOpacity={0.7}
      style={styles.touchable}
    >
      <View style={[styles.card, { borderLeftColor: badgeColor }]}>
        {/* Header Section: Order Info + Status Badge */}
        <View style={styles.headerSection}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>{task.orderId}</Text>
            <Text style={styles.taskId}>Task ID: {task.taskId}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>

        {/* Details Grid Section */}
        <View style={styles.detailsGrid}>
          {/* Row 1: Factory + Stage */}
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Factory</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {task.factory}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Stage</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {task.stage}
              </Text>
            </View>
          </View>

          {/* Row 2: Product + Due Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Product</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {task.product}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
    marginTop: 0,
  },
  card: {
    backgroundColor: ColorConstants.surface,
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 5,
    shadowColor: ColorConstants.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorConstants.inputBase,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: ColorConstants.darkText,
    marginBottom: 4,
  },
  taskId: {
    fontSize: 14,
    fontWeight: "500",
    color: ColorConstants.mediumText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: ColorConstants.surface,
    textTransform: "capitalize",
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: 0, // Important for text truncation in flex items
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: ColorConstants.faintText,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: ColorConstants.darkText,
    lineHeight: 20,
  },
});

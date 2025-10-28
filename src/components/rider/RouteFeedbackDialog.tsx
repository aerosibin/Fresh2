import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RouteFeedbackDialogProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

const RouteFeedbackDialog = ({
  orderId,
  open,
  onClose,
}: RouteFeedbackDialogProps) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackType || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setSubmitting(false);
      return;
    }

    // @ts-ignore - Types will regenerate after migration
    const { error } = await supabase.from("route_feedback")
      .insert({
      rider_id: user.id,
      order_id: orderId,
      feedback_type: feedbackType,
      description,
    } as any);

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit feedback");
      return;
    }

    toast.success("Feedback submitted successfully");
    setFeedbackType("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Route Issue</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Issue Type
            </label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traffic">Traffic Congestion</SelectItem>
                <SelectItem value="road_condition">Poor Road Condition</SelectItem>
                <SelectItem value="route_suggestion">Route Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteFeedbackDialog;

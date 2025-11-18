import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/type";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
    toast.success("Message Deleted successfully");
    onMessageDelete(message._id as string);
  };

  return (
    <Card className="group relative border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white dark:bg-zinc-900">
      <CardHeader className="p-6">
        {/* Delete Button */}
        <div className="absolute top-3 right-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <X className="w-5 h-5 text-red-500" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Message Content */}
        <CardTitle className="text-lg text-left font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          {message.content}
        </CardTitle>

        {/* Message Date */}
        <CardDescription className="text-sm mt-2 text-right text-gray-500 dark:text-gray-400">
          {new Date(message.createdAt).toDateString()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

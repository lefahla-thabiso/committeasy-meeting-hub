
import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documents } from "@/data/mockData";
import { format } from "date-fns";

const RecentDocumentsWidget = () => {
  // Sort documents by upload date (newest first)
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Recent Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedDocuments.slice(0, 5).map((doc) => (
            <div key={doc.id} className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
              <div className="font-medium">{doc.title}</div>
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-500">
                  Uploaded by {doc.uploadedBy.name}
                </div>
                <Badge variant="outline" className="text-xs">
                  {format(new Date(doc.uploadedAt), "MMM d")}
                </Badge>
              </div>
            </div>
          ))}
          
          {sortedDocuments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No documents available
            </div>
          )}
          
          {sortedDocuments.length > 5 && (
            <div className="text-center pt-2">
              <a href="/documents" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View all documents
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDocumentsWidget;

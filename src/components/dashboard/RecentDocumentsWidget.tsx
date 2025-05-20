
import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type Document = Database['public']['Tables']['documents']['Row'] & {
  uploader?: {
    name: string;
    avatar: string | null;
  } | null;
};

const RecentDocumentsWidget = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploader:uploaded_by(name, avatar)
        `)
        .order('uploaded_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data as Document[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (document: Document) => {
    window.open(document.url, "_blank");
  };

  const handleViewAll = () => {
    navigate('/documents');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Recent Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="font-medium">{doc.title}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">
                    {doc.uploader ? `Uploaded by ${doc.uploader.name}` : "Unknown uploader"}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {format(new Date(doc.uploaded_at), "MMM d")}
                  </Badge>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No documents available
              </div>
            )}
            
            {documents.length > 0 && (
              <div className="text-center pt-2">
                <button 
                  onClick={handleViewAll}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View all documents
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDocumentsWidget;


import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

// Define the Document type with correct structure matching Supabase response
type Document = Database['public']['Tables']['documents']['Row'] & {
  uploader?: {
    name: string;
    avatar: string | null;
  } | null;
  meeting?: {
    title: string;
  } | null;
};

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documents')
          .select(`
            *,
            uploader:uploaded_by(name, avatar),
            meeting:meeting_id(title)
          `)
          .order('uploaded_at', { ascending: false });

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

    fetchDocuments();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>{document.title}</span>
                  </CardTitle>
                  {document.meeting && (
                    <p className="text-sm text-gray-500">
                      Meeting: {document.meeting.title}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-500">
                      Uploaded {format(new Date(document.uploaded_at), "MMM d, yyyy")}
                    </div>
                    {document.is_minutes && (
                      <Badge className="bg-purple-100 text-purple-800">
                        Minutes
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {document.uploader ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={document.uploader.avatar || undefined} alt={document.uploader.name} />
                          <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{document.uploader.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown uploader</span>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <a href={document.url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {documents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No documents found</h3>
                <p className="mt-1 text-gray-500">Get started by uploading a new document.</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Documents;

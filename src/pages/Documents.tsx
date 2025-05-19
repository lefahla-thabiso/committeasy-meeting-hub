
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive",
        });
        return;
      }

      setDocuments(data as Document[]);
      setFilteredDocuments(data as Document[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const handleViewDocument = (document: Document) => {
    // Open document in a new tab
    window.open(document.url, "_blank");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            {filteredDocuments.map((document) => (
              <Card 
                key={document.id} 
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewDocument(document)}
              >
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
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No documents found</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery ? "Try a different search term." : "Get started by uploading a new document."}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" onClick={() => setUploadDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={fetchDocuments}
      />
    </MainLayout>
  );
};

export default Documents;

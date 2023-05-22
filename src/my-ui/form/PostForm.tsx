"use client"

import { CustomPostType } from "@/state/pb/api/posts/types";
import { useFormHook } from "./useFormHook";
import { useMutation } from "@tanstack/react-query";
import { PostMutationInput, createNewPost, updatePost } from "@/state/pb/api/posts/posts";
import { Button } from "./components/Button";
import { ErrorOutput } from "../wrappers/ErrorOutput";
import { ImageInput } from "./components/ImageInput";
import { FormTextArea } from "./components/FormTextArea";
import { Close } from "@radix-ui/react-dialog"
import { X } from "lucide-react";





interface PostMutattionFormProps {
label:string
custom_post?:CustomPostType
}



export function PostMutattionForm({label,custom_post}:PostMutattionFormProps){

const{error,handleChange,input,setInput,setError} = useFormHook<PostMutationInput>({
initialValues:{
 body:'',
 media:"",
 title:"",
 user:"",
}
 }) 






    const mutation = useMutation({ mutationFn:createNewPost})
    const update_mutation = useMutation({ mutationFn:updatePost})

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log("input before save", input)
        const formdata = new FormData(e.currentTarget);
            for (const key in input) {
            if (input[key as keyof typeof input] !== "") {
                // @ts-expect-error
                formdata.append(key, input[key]);
            }
        }



        if(custom_post&&custom_post.post_id){
            update_mutation.mutate(
                { id: custom_post.post_id as string, data:formdata },
                { onSuccess(data, variables, context) {
                    console.log("post added ==== ", data)
                    setError({ name: "", message: "" })
                },onError(error, variables, context) {
                    console.log("post error  ==== ", error)
                    setError({message:error.message, name: "main"})
                },
                
                }
            )
  
        }
        else{
            mutation.mutate(
                { data: formdata },
                {
                    onSuccess(data, variables, context) {
                        console.log("post added ==== ",data)
                        setError({ name: "", message: "" })
                    }, onError(error, variables, context) {
                        console.log("post error  ==== ",error)
                        setError({ message: error.message, name: "main" })
                    },

                }
            )
        }
    
    };

const disable_submit = (input.body === "" || (input.media === "" || !input.media))
return (
 <div className='w-full h-full flex flex-col  items-center justify-center gap-4'>

        <form
            onSubmit={handleSubmit}
            className="w-full  h-fit min-h-[40%] border-2 shadow-xl rounded-xl p-3 gap-3 m-5
            flex flex-col items-center justify-start bg-primary overflow-y-scroll scroll-bar">

            <div className="w-full flex justify-end rounded-sm">
                <Close >
                    <X className="h-5 w-5 focus:text-accent-foreground" />
                    <span className="sr-only">Close</span>
                </Close>
                </div>


            {/* location */}
            {/* property location */}
  
            
            <FormTextArea<PostMutationInput>
                error={error}
                onChange={handleChange}
                input={input}
                placeholder="What's on your mind"
                prop="body"
                className="rounded-lg scroll-bar bg-primary w-full outline-0 p-2 min-h-[150px] h-fit"
            />
            {/* image input section  */}
            {/* <div className="relative h-[40%] w-full"> */}
                    <ImageInput

                        image={input.media as string}
                        alt_image=""
                        updateImage={(image) => {
                            setInput((prev) => {
                                return {
                                    ...prev,
                                    media: image
                                }
                            })
                        }

                        }

                    />
            {/* </div> */}
    


            <Button
            className="w-[50%] px-2 hover:text-accent hover:border-accent hover:brightness-105 rounded-full" 
            isLoading={mutation.isPending} 
            disabled={disable_submit||mutation.isPending}
            label="post" type="submit"/>

            {error.message !== "" && <ErrorOutput error={error} />}
        </form>
   

 </div>
);
}
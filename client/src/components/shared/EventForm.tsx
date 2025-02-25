import { eventFormSchema } from "@/utils/validator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventDefaultValues } from "@/constants/data";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import Dropdown from "./DropDown";
import { Textarea } from "../ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/apiResponse";
import { useNavigate } from "react-router-dom";

const EventForm = () => {
	const [files, setFiles] = useState<File[]>([]);
	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof eventFormSchema>>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: eventDefaultValues,
	});

	async function onSubmit(values: z.infer<typeof eventFormSchema>) {
		try {
			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("description", values.description);
			formData.append("location", values.location);
			formData.append("url", values.url);
			formData.append("startDate", values.startDate.toString());
			formData.append("endDate", values.endDate.toString());
			formData.append("categoryId", values.categoryId);
			formData.append("price", values.price.toString());
			formData.append("isFree", values.isFree.toString());

			if (files.length > 0) {
				formData.append("image", files[0]);
			}
			const res = await axios.post("/events", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			navigate(`/events/${res.data.data.event}`);
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			const errorMessage = axiosError.response?.data.message;

			toast({
				title: "Signup failed.",
				description: errorMessage ?? "An error occurred while signup.",
				duration: 3000,
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				<motion.div
					className="flex flex-col gap-5 md:flex-row"
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="w-full border border-foreground rounded-full">
								<FormControl>
									<Input
										placeholder="Event title"
										{...field}
										className="input-field"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Dropdown
										onChangeHandler={field.onChange}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					className="flex flex-col gap-5 md:flex-row"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl className="h-72">
									<Textarea
										placeholder="Description"
										{...field}
										className="textarea rounded-2xl"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl className="h-72">
									<FileUploader
										onFieldChange={field.onChange}
										setFiles={setFiles}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					className="flex flex-col gap-5 md:flex-row"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center h-[54px] w-full overflow-hidden rounded-full border border-foreground px-4 py-2">
										<img
											src="/location-grey.svg"
											alt="calendar"
											width={24}
											height={24}
										/>

										<Input
											placeholder="Event location or Online"
											{...field}
											className="input-field border-r-0"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					className="flex flex-col gap-5 md:flex-row"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<FormField
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center gap-2 h-[54px] w-full overflow-hidden rounded-full border border-foreground px-4 py-2">
										<img
											src="/calendar.svg"
											alt="calendar"
											width={24}
											height={24}
											className="filter-grey"
										/>
										<p className="ml-3 whitespace-nowrap text-grey-600">
											Start Date:
										</p>
										<DatePicker
											selected={field.value}
											onChange={(date: Date | null) =>
												field.onChange(date)
											}
											className="bg-transparent mr-2 placeholder:text-grey-600 outline-none border-none"
											placeholderText="Click to select a date"
											showTimeSelect
											timeInputLabel="Time:"
											dateFormat="MM/dd/yyyy h:mm aa"
											wrapperClassName="datePicker"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="endDate"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center gap-2 h-[54px] w-full overflow-hidden rounded-full border border-foreground px-4 py-2">
										<img
											src="/calendar.svg"
											alt="calendar"
											width={24}
											height={24}
											className="filter-grey"
										/>
										<p className="ml-3 whitespace-nowrap text-grey-600">
											End Date:
										</p>
										<DatePicker
											selected={field.value}
											onChange={(date: Date | null) =>
												field.onChange(date)
											}
											className="bg-transparent mr-2 placeholder:text-grey-600 outline-none border-none"
											placeholderText="Click to select a date"
											showTimeSelect
											timeInputLabel="Time:"
											dateFormat="MM/dd/yyyy h:mm aa"
											wrapperClassName="datePicker"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					className="flex flex-col items-center gap-5 md:flex-row"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center h-[54px] w-full overflow-hidden rounded-full border border-foreground px-4 py-2">
										<img
											src="/dollar.svg"
											alt="dollar"
											width={24}
											height={24}
											className="filter-grey"
										/>
										<Input
											type="number"
											placeholder="Price"
											{...field}
											className="input-field"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="isFree"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex items-center">
										<label
											htmlFor="isFree"
											className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											Free Ticket
										</label>
										<Checkbox
											onCheckedChange={field.onChange}
											checked={field.value}
											id="isFree"
											className="mr-2 h-5 w-5 border-2"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="url"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<div className="flex-center h-[54px] w-full overflow-hidden rounded-full border border-foreground px-4 py-2">
										<img
											src="/link.svg"
											alt="link"
											width={24}
											height={24}
										/>

										<Input
											placeholder="URL"
											{...field}
											className="input-field"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					className="flex flex-col gap-5 md:flex-row"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				></motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.6 }}
				>
					<Button
						type="submit"
						size="lg"
						disabled={form.formState.isSubmitting}
						className="button col-span-2 w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
					>
						{form.formState.isSubmitting
							? "Creating..."
							: "Create Event"}
					</Button>
				</motion.div>
			</form>
		</Form>
	);
};

export default EventForm;

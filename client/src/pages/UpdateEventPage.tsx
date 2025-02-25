import UpdateEvent from "@/components/shared/UpdateEvent";

const UpdateEventPage = () => {
	return (
		<main>
			<section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<h3 className="wrapper h3-bold text-center sm:text-left">
					Update Event
				</h3>
			</section>

			<div className="wrapper my-8">
				<UpdateEvent />
			</div>
		</main>
	);
};

export default UpdateEventPage;

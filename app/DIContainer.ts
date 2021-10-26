// Repository
import TableRepository from './repositories/TableRepository';
import TableReservationRepository from './repositories/TableReservationRepository';

// Services
import TableReservationService from './services/TableReservationService';
import TableService from './services/TableService';

// controllers
import TableController from './controllers/v1/TableController';
import TableReservationController from './controllers/v1/TableReservationController';

class DIContainer {

    // Repository
    public readonly tableRepository = new TableRepository();
    public readonly tableReservationRepository = new TableReservationRepository();

    // services
    public readonly tableReservationService = new TableReservationService(this.tableReservationRepository);
    public readonly tableService = new TableService(this.tableRepository);

    // controllers
    public v1 = {
        tableReservationsController: new TableReservationController(this.tableReservationService, this.tableService),
        tableController: new TableController(this.tableService),
    };

}

export default new DIContainer();

import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import OrderItemsModel from "./order.items.model";

@Table({
    tableName: "order",
    timestamps: false
})
export default class OrderModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    
    @Column({allowNull: false})
    declare client_id: string;

    @Column({allowNull: false})
    declare client_name: string;

    @Column({allowNull: false})
    declare client_email: string;

    @Column({allowNull: false})
    declare client_document: string;

    @Column({allowNull: false})
    declare client_street: string;

    @Column({allowNull: false})
    declare client_number: string;

    @Column({allowNull: false})
    declare client_complement: string;

    @Column({allowNull: false})
    declare client_city: string;

    @Column({allowNull: false})
    declare client_state: string;

    @Column({allowNull: false})
    declare client_zip_code: string;

    @Column({allowNull: false})
    declare client_createdAt: Date;

    @Column({allowNull: false})
    declare client_updatedAt: Date;

    @HasMany(() => OrderItemsModel)
    declare products: OrderItemsModel[];

    @Column({allowNull: false})
    declare status: string;
}
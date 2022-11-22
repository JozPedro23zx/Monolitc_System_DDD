import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import { ProductCatalogModel } from "../../store-catalog/repository/product.model";
import OrderModel from "./order.model";


@Table({
    tableName: "orderItems",
    timestamps: false
})

export default class OrderItemsModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(() => ProductCatalogModel)
    @Column({allowNull: false})
    declare product_id: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare description: string;

    @Column({allowNull: false})
    declare salesPrice: number;
}
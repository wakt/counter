class CreateFuelprices < ActiveRecord::Migration
  def change
    create_table :fuelprices do |t|

      t.timestamps
    end
  end
end

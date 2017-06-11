class CreateRackprices < ActiveRecord::Migration
  def change
    create_table :rackprices do |t|

      t.timestamps
    end
  end
end

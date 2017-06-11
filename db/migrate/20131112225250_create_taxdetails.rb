class CreateTaxdetails < ActiveRecord::Migration
  def change
    create_table :taxdetails do |t|

      t.timestamps
    end
  end
end

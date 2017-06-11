class CreateCarbontaxrefunds < ActiveRecord::Migration
  def change
    create_table :carbontaxrefunds do |t|

      t.timestamps
    end
  end
end
